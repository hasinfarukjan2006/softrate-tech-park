import sys
sys.path.insert(0, ".")
import unittest
from test_app import GstCalculatorTestCase

suite = unittest.TestLoader().loadTestsFromTestCase(GstCalculatorTestCase)
runner = unittest.TextTestRunner(stream=sys.stdout, verbosity=2)
result = runner.run(suite)

with open("scratch/test_fail_log.txt", "w", encoding="utf-8") as f:
    if not result.wasSuccessful():
        f.write("FAILURES:\n")
        for test, err in result.failures:
            f.write(f"Test: {test}\n")
            f.write(f"Error: {err}\n\n")
        for test, err in result.errors:
            f.write(f"Test: {test}\n")
            f.write(f"Error: {err}\n\n")
    else:
        f.write("All tests passed!\n")
