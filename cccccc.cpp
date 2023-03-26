#include <stdio.h>
#include <stdlib.h>
#include <math.h>

// Fungsi untuk menyelesaikan sistem persamaan linear dengan metode eliminasi Gauss
void gaussianElimination(double a[5][6]) {
    int i, j, k;
    double m;
    // Pivoting
    for (i = 0; i < 5; i++) {
        double max = fabs(a[i][i]);
        int max_row = i;
        for (j = i + 1; j < 5; j++) {
            if (fabs(a[j][i]) > max) {
                max = fabs(a[j][i]);
                max_row = j;
            }
        }
        for (j = 0; j < 6; j++) {
            double temp = a[max_row][j];
            a[max_row][j] = a[i][j];
            a[i][j] = temp;
        }
    }
    // Eliminasi
    for (i = 0; i < 4; i++) {
        for (j = i + 1; j < 5; j++) {
            m = a[j][i] / a[i][i];
            for (k = i; k < 6; k++) {
                a[j][k] -= m * a[i][k];
            }
        }
    }
}

int main() {
    int T, i, j;
    scanf("%d", &T);
    for (i = 1; i <= T; i++) {
        double a[5][6];
        for (j = 0; j < 25; j++) {
            scanf(" %lf", &a[j / 5][j % 5]);
        }
        // Menambahkan kolom konstanta
        for (j = 0; j < 5; j++) {
            a[j][5] = a[j][0];
        }
        gaussianElimination(a);
        printf("Case #%d: ", i);
        // Mencari solusi sistem persamaan
        for (j = 4; j >= 0; j--) {
            a[j][5] /= a[j][j];
            a[j][j] = 1;
            for (int k = j - 1; k >= 0; k--) {
                a[k][5] -= a[k][j] * a[j][5];
                a[k][j] = 0;
            }
            printf("%d ", (int)round(a[j][5]));
        }
     printf("\n");
}
return 0;
}

