#include <iostream>
#include <math.h>
using namespace std;

int t, x1, x2, y, y2, caseNum;

//Fungsi untuk menghitung langkah minimal kuda
int minSteps(int x1, int y1, int x2, int y2) {
    //Jika posisi awal dan posisi tujuan sama
    if (x1 == x2 && y1 == y2) {
        return 0;
    }
    //Jika posisi tujuan hanya satu langkah dari posisi awal
    if (abs(x1 - x2) == 1 && abs(y1 - y2) == 2 || abs(x1 - x2) == 2 && abs(y1 - y2) == 1) {
        return 1;
    }
    //Menggunakan rekursi untuk mencari langkah minimal
    int x = min(x1, x2);
    int y = min(y1, y2);
    return minSteps(x + 2, y + 1, x2, y2) + 1;
}

int main() {
    cin >> t;
    while (t--) {
        caseNum++;
        cin >> x1 >> y >> x2 >> y2;
        //Mengubah input dari huruf ke angka
        x1 = x1 - 'A' + 1;
        x2 = x2 - 'A' + 1;
        cout << "Case #" << caseNum << ": " << minSteps(x1, y, x2, y2) << endl;
    }
    return 0;
}

