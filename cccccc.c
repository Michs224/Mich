#include <stdio.h>
int i,j,k;
void gaussianElimination(int n, double a[][n+1], double x[]) {
    for (i = 0; i < n; i++) {
        // Finding the pivot element
        double maxEl = fabs(a[i][i]);
        int maxRow = i;
        for (k = i+1; k < n; k++) {
            if (fabs(a[k][i]) > maxEl) {
                maxEl = fabs(a[k][i]);
                maxRow = k;
            }
        }

        // Swap the pivot row with the current row
        for (k = i; k <= n; k++) {
            double temp = a[maxRow][k];
            a[maxRow][k] = a[i][k];
            a[i][k] = temp;
        }

        // Elimination of the pivot element
        for (k = i+1; k < n; k++) {
            double c = -a[k][i] / a[i][i];
            for (j = i; j <= n; j++) {
                if (i == j) {
                    a[k][j] = 0;
                } else {
                    a[k][j] += c * a[i][j];
                }
            }
        }
    }

    // Back-substitution
    for (i = n-1; i >= 0; i--) {
        x[i] = a[i][n] / a[i][i];
        for (k = i-1; k >= 0; k--) {
            a[k][n] -= a[k][i] * x[i];
        }
    }
}

int main() {
    int T,t;
    scanf("%d", &T);

    for (t = 1; t <= T; t++) {
        int n;
        scanf("%d", &n);
        int a[n][n+1] = {0};
        int Mi[n] = {0};

        for (int i = 0; i < n; i++) {
            a[i][i] = 1;
        }

        for (int i = 0; i < n; i++) {
            int j;
            scanf("%d %d %d", &Mi[i], &j, &Mi[j]);
            a[i][j] = 1;
            a[j][i] = 1;
        }

        double x[n];
        gaussianElimination(n, a, x);

        printf("Case #%d: ", t);
        for (int i = 0; i < n; i++) {
            int res = (int) (x[i] - Mi[i]);
            printf("%d ", res);
        }
        printf("\n");
    }

    return 0;
}

