import os
import sys
import subprocess
import json
import hmac
import hashlib
import urllib.request
import time

def sign_payload(payload_bytes, secret):
    mac = hmac.new(secret.encode(), msg=payload_bytes, digestmod=hashlib.sha256)
    return f"sha256={mac.hexdigest()}"

def send_callback(api_url, payload, secret):
    url = f"{api_url}/api/webhooks/github"
    payload_bytes = json.dumps(payload).encode('utf-8')
    signature = sign_payload(payload_bytes, secret)
    
    req = urllib.request.Request(
        url,
        data=payload_bytes,
        headers={
            "Content-Type": "application/json",
            "X-Hub-Signature-256": signature
        },
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Callback successful. Status code: {response.status}")
            return True
    except Exception as e:
        print(f"Error sending callback: {e}", file=sys.stderr)
        return False

def run_tests():
    # Load test cases from tests.json if present, or use defaults
    test_cases = []
    if os.path.exists("tests.json"):
        try:
            with open("tests.json", "r") as f:
                test_cases = json.load(f)
        except Exception as e:
            print(f"Warning: Failed to load tests.json: {e}. Running default compile check.", file=sys.stderr)
            
    if not test_cases:
        # Default sanity test case
        test_cases = [
            {"name": "Execution sanity check", "input": "", "expected": "", "score": 100}
        ]
        
    results = []
    total_score = 0
    max_score = sum(tc.get("score", 0) for tc in test_cases)
    
    for tc in test_cases:
        name = tc["name"]
        input_data = tc.get("input", "")
        expected_output = tc.get("expected", "").strip()
        tc_score = tc.get("score", 0)
        
        # Run compiled binary in isolated sandbox environment (represented here by subproc constraints)
        # Apply execution constraints (e.g. 2s timeout)
        try:
            proc = subprocess.run(
                ["./main"],
                input=input_data,
                text=True,
                capture_output=True,
                timeout=2.0 # 2s execution limit
            )
            
            output = proc.stdout.strip()
            passed = output == expected_output and proc.returncode == 0
            
            # Valgrind check (Optional style signal)
            if "valgrind" in name.lower():
                valgrind_proc = subprocess.run(
                    ["valgrind", "--leak-check=full", "./main"],
                    input=input_data,
                    text=True,
                    capture_output=True,
                    timeout=5.0
                )
                passed = "no leaks" in valgrind_proc.stderr.lower() or "0 errors from 0 contexts" in valgrind_proc.stderr.lower()
                output = valgrind_proc.stderr.strip()
            
            results.append({
                "test_case_name": name,
                "passed": passed,
                "student_output": output if not passed else None, # Only return output on failure to minimize payload
                "expected_output": expected_output if not passed else None
            })
            
            if passed:
                total_score += tc_score
                
        except subprocess.TimeoutExpired:
            results.append({
                "test_case_name": name,
                "passed": False,
                "student_output": "Execution timed out (Limit: 2.0s)",
                "expected_output": expected_output
            })
        except Exception as e:
            results.append({
                "test_case_name": name,
                "passed": False,
                "student_output": f"Runtime error: {e}",
                "expected_output": expected_output
            })
            
    final_score = int((total_score / max_score) * 100) if max_score > 0 else 100
    return final_score, results

def main():
    submission_id = os.getenv("SUBMISSION_ID")
    commit_hash = os.getenv("COMMIT_HASH", "unknown_commit")
    api_url = os.getenv("API_URL", "http://localhost:8000")
    webhook_secret = os.getenv("WEBHOOK_SECRET")
    
    if not submission_id or not webhook_secret:
        print("Error: SUBMISSION_ID and WEBHOOK_SECRET env vars are required.", file=sys.stderr)
        sys.exit(1)
        
    print(f"Starting grading pipeline for submission: {submission_id} (Commit: {commit_hash})")
    
    # 1. Compile C file
    c_file = "main.c"
    if not os.path.exists(c_file):
        payload = {
            "submission_id": submission_id,
            "commit_hash": commit_hash,
            "compile_success": False,
            "compiler_error_log": f"Error: {c_file} not found in repository root.",
            "correctness_score": 0,
            "test_results": []
        }
        send_callback(api_url, payload, webhook_secret)
        sys.exit(0)
        
    # Standard compilation flags
    compile_cmd = ["gcc", "-Wall", "-Werror", "-o", "main", c_file]
    proc = subprocess.run(compile_cmd, capture_output=True, text=True)
    
    if proc.returncode != 0:
        print("Compilation failed.")
        payload = {
            "submission_id": submission_id,
            "commit_hash": commit_hash,
            "compile_success": False,
            "compiler_error_log": proc.stderr,
            "correctness_score": 0,
            "test_results": []
        }
        send_callback(api_url, payload, webhook_secret)
        sys.exit(0)
        
    print("Compilation successful. Running tests...")
    
    # 2. Run test suite
    score, test_results = run_tests()
    
    # 3. Callback to server
    payload = {
        "submission_id": submission_id,
        "commit_hash": commit_hash,
        "compile_success": True,
        "compiler_error_log": "Compilation successful.",
        "correctness_score": score,
        "test_results": test_results
    }
    
    send_callback(api_url, payload, webhook_secret)
    print("Grading process complete.")

if __name__ == "__main__":
    main()
