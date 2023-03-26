#include <stdio.h>

int count = 0;

void countFloor(char arr[][100], int n, int m, int i, int j) {
    if (i < 0 || j < 0 || i >= n || j >= m || arr[i][j] == '#') {
        return;
    }
    if (arr[i][j] == '.') {
        count++;
    }
    arr[i][j] = '#';
    countFloor(arr, n, m, i + 1, j);
    countFloor(arr, n, m, i - 1, j);
    countFloor(arr, n, m, i, j + 1);
    countFloor(arr, n, m, i, j - 1);
}

int main() {
    int t;
    scanf("%d", &t);
    for (int i = 0; i < t; i++) {
        int n, m;
        scanf("%d %d", &n, &m);
        char arr[n][100];
        for (int j = 0; j < n; j++) {
            scanf("%s", arr[j]);
        }
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < m; k++) {
                if (arr[j][k] == 'S') {
                    countFloor(arr, n, m, j, k);
                }
            }
        }
        printf("Case #%d: %d\n", i + 1, count);
        count = 0;
    }
    return 0;
}
