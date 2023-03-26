#include <iostream>
#include <map>
using namespace std;

int main() {
    int t;
    cin >> t;
    for (int i = 1; i <= t; i++) {
        int s, a[15] = {};
        cin >> s;
        for (int j = 1; j <= 25; j++) {
            s -= j;
            if (s <= 0) {
                a[25 - j + 1] = s + j;
                break;
            }
            a[25 - j] = j;
        }
        cout << "Case #" << i << ":";
        for (int j = 0; j < 5; j++) cout << " " << a[j];
        cout << endl;
    }
    return 0;
}


