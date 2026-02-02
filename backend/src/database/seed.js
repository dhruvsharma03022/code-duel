import pool from '../config/database.js';

const sampleProblems = [
  {
    title: 'Two Sum',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: 'Easy',
    test_cases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        output: [0, 1],
        explanation: 'nums[0] + nums[1] == 9, so we return [0, 1]'
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        output: [1, 2]
      },
      {
        input: { nums: [3, 3], target: 6 },
        output: [0, 1]
      }
    ],
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9'
  },
  {
    title: 'Palindrome Number',
    description: `Given an integer x, return true if x is a palindrome, and false otherwise.

An integer is a palindrome when it reads the same backward as forward.

For example, 121 is a palindrome while 123 is not.`,
    difficulty: 'Easy',
    test_cases: [
      { input: { x: 121 }, output: true },
      { input: { x: -121 }, output: false },
      { input: { x: 10 }, output: false }
    ],
    constraints: '-2^31 <= x <= 2^31 - 1'
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    difficulty: 'Medium',
    test_cases: [
      { input: { s: 'abcabcbb' }, output: 3, explanation: 'The answer is "abc", with the length of 3' },
      { input: { s: 'bbbbb' }, output: 1, explanation: 'The answer is "b", with the length of 1' },
      { input: { s: 'pwwkew' }, output: 3, explanation: 'The answer is "wke", with the length of 3' }
    ],
    constraints: '0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces'
  },
  {
    title: 'Merge Two Sorted Lists',
    description: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
    difficulty: 'Easy',
    test_cases: [
      { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, output: [1, 1, 2, 3, 4, 4] },
      { input: { list1: [], list2: [] }, output: [] },
      { input: { list1: [], list2: [0] }, output: [0] }
    ],
    constraints: 'The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100'
  },
  {
    title: 'Valid Parentheses',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: 'Easy',
    test_cases: [
      { input: { s: '()' }, output: true },
      { input: { s: '()[]{}' }, output: true },
      { input: { s: '(]' }, output: false }
    ],
    constraints: '1 <= s.length <= 10^4\ns consists of parentheses only \'()[]{}\'.'
  },
  {
    title: 'Reverse Integer',
    description: `Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.`,
    difficulty: 'Medium',
    test_cases: [
      { input: { x: 123 }, output: 321 },
      { input: { x: -123 }, output: -321 },
      { input: { x: 120 }, output: 21 }
    ],
    constraints: '-2^31 <= x <= 2^31 - 1'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Insert problems
    for (const problem of sampleProblems) {
      await pool.query(
        `INSERT INTO problems (title, description, difficulty, test_cases, constraints)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [
          problem.title,
          problem.description,
          problem.difficulty,
          JSON.stringify(problem.test_cases),
          problem.constraints
        ]
      );
      console.log(`✅ Inserted problem: ${problem.title}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
