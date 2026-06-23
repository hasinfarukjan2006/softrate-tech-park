import unittest
from test_app import GstCalculatorTestCase

suite = unittest.TestLoader().loadTestsFromTestCase(GstCalculatorTestCase)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
