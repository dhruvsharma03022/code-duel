console.log("test.js loaded");

function runTests() {
  console.log("Running regression suite...");

  function assert(condition, message) {
    if (!condition) {
      console.error("❌ Test Failed:", message);
    } else {
      console.log("✅", message);
    }
  }

  // TEST 1: Login Flow
  loginUser({ username: "dhruv", elo: 1200 });
  assert(STATE.user.username === "dhruv", "Login sets user correctly");

  // TEST 2: Matchmaking Screen
  startMatchmaking();
  assert(
    document.getElementById('matchmaking').classList.contains('active'),
    "Matchmaking screen opens"
  );

  // TEST 3: Match Found Flow
  matchFound();
  assert(STATE.currentMatch !== null, "Match is created");

  // TEST 4: Arena Start
  startArena();
  assert(
    document.getElementById('arena').classList.contains('active'),
    "Arena screen loads"
  );

  // TEST 5: Code Submission
  document.getElementById('code-editor').value = "print('hello')";
  submitCode();

  setTimeout(() => {
    assert(STATE.currentMatch.resolved === true, "Submission resolves match");
  }, 3000);
}