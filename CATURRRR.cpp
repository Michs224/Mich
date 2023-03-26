#include <iostream>
using namespace std;

int t;

int abs(int x) {
    if (x < 0) return -x;
    return x;
}

int main() {
    cin >> t;
    for (int i = 1; i <= t; i++) {
        char x1, x2; int y1, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        x1 = x1 - 'A' + 1;
        x2 = x2 - 'A' + 1;
        int x = abs(x1 - x2);
        int y = abs(y1 - y2);
        cout << "Case #" << i << ": ";
        if (x == 2 || y == 2) cout << 1 << endl;
        else cout << 2 << endl;
    }
    return 0;
}


