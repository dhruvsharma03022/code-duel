import axios from 'axios';

const PISTON_API_URL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';

// Language mappings for Piston API
const languageMap = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'cpp', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.68.2' }
};

class CodeExecutionService {
  static async execute(code, language, input = '') {
    try {
      const langConfig = languageMap[language.toLowerCase()];
      
      if (!langConfig) {
        throw new Error(`Unsupported language: ${language}`);
      }

      const response = await axios.post(`${PISTON_API_URL}/execute`, {
        language: langConfig.language,
        version: langConfig.version,
        files: [
          {
            name: `main.${this.getFileExtension(language)}`,
            content: code
          }
        ],
        stdin: input,
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1
      });

      return {
        success: true,
        output: response.data.run.output || '',
        stdout: response.data.run.stdout || '',
        stderr: response.data.run.stderr || '',
        exitCode: response.data.run.code,
        executionTime: response.data.run.time || 0
      };
    } catch (error) {
      console.error('Code execution error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        output: '',
        stderr: error.message
      };
    }
  }

  static async runTestCases(code, language, testCases) {
    const results = [];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      // Prepare input based on test case format
      const input = this.prepareInput(testCase.input);
      
      const result = await this.execute(code, language, input);
      
      // Check if output matches expected
      const passed = this.compareOutput(
        result.stdout.trim(),
        this.prepareExpectedOutput(testCase.output)
      );

      results.push({
        testCase: i + 1,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: result.stdout.trim(),
        passed,
        executionTime: result.executionTime,
        error: result.stderr || null
      });

      // If test fails, we might want to continue or stop
      // For now, continue running all tests
    }

    const allPassed = results.every(r => r.passed);
    const passedCount = results.filter(r => r.passed).length;

    return {
      allPassed,
      passedCount,
      totalTests: testCases.length,
      results
    };
  }

  static prepareInput(input) {
    if (typeof input === 'object') {
      // Convert object to string representation
      return Object.values(input).map(val => 
        Array.isArray(val) ? val.join(' ') : String(val)
      ).join('\n');
    }
    return String(input);
  }

  static prepareExpectedOutput(output) {
    if (Array.isArray(output)) {
      return JSON.stringify(output);
    }
    return String(output);
  }

  static compareOutput(actual, expected) {
    // Normalize outputs for comparison
    const normalizeOutput = (str) => {
      return str
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();
    };

    const normalizedActual = normalizeOutput(actual);
    const normalizedExpected = normalizeOutput(expected);

    // Try exact match first
    if (normalizedActual === normalizedExpected) {
      return true;
    }

    // Try JSON parsing if both look like JSON
    try {
      const actualJson = JSON.parse(actual);
      const expectedJson = JSON.parse(expected);
      return JSON.stringify(actualJson) === JSON.stringify(expectedJson);
    } catch {
      // Not JSON, continue with other checks
    }

    // Try numeric comparison
    const actualNum = parseFloat(actual);
    const expectedNum = parseFloat(expected);
    if (!isNaN(actualNum) && !isNaN(expectedNum)) {
      return Math.abs(actualNum - expectedNum) < 0.0001;
    }

    return false;
  }

  static getFileExtension(language) {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      go: 'go',
      rust: 'rs'
    };
    return extensions[language.toLowerCase()] || 'txt';
  }

  static async getAvailableLanguages() {
    try {
      const response = await axios.get(`${PISTON_API_URL}/runtimes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
  }
}

export default CodeExecutionService;
