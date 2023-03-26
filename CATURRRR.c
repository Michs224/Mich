#include <iostream>
using namespace std;

int t, x1, y1, x2, y2, caseNum;

int minSteps(int x1, int y1, int x2, int y2) {
    // base case
    if (x1 == x2 && y1 == y2) return 0;
    // move diagonally if possible
    if (abs(x1-x2) == abs(y1-y2)) return 1;
    // move horizontally or vertically
    return 2;
}

int main() {
    cin >> t;
    while (t--) {
        caseNum++;
        cin >> x1 >> y1 >> x2 >> y2;
        x1 = x1 - 'A' + 1;
        x2 = x2 - 'A' + 1;
        cout << "Case #" << caseNum << ": " << minSteps(x1, y1, x2, y2) << endl;
    }
    return 0;
}

