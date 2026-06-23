import subprocess
import os

try:
    result = subprocess.run(
        [".venv/Scripts/python.exe", "-m", "unittest", "test_app", "-v"],
        capture_output=True,
        text=True,
        cwd=os.getcwd()
    )
    with open("scratch/test_output.txt", "w", encoding="utf-8") as f:
        f.write("=== STDOUT ===\n")
        f.write(result.stdout)
        f.write("\n=== STDERR ===\n")
        f.write(result.stderr)
    print("Saved test output to scratch/test_output.txt")
except Exception as e:
    print("Error:", e)
