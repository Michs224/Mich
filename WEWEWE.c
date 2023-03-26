#include <stdio.h>
#include <stdbool.h>

int count_floors_to_replace(char denah[100][100], int x, int y, bool visited[100][100], int N, int M) {
    if (x < 0 || x >= N || y < 0 || y >= M || visited[x][y]) {
        return 0;
    }
    if (denah[x][y] != '.') {
        return 0;
    }
    visited[x][y] = true;
    int count = 1;
    count += count_floors_to_replace(denah, x + 1, y, visited, N, M);
    count += count_floors_to_replace(denah, x - 1, y, visited, N, M);
    count += count_floors_to_replace(denah, x, y + 1, visited, N, M);
    count += count_floors_to_replace(denah, x, y - 1, visited, N, M);
    return count;
}

int main() {
    int T;
    scanf("%d", &T);

    for (int i = 1; i <= T; i++) {
        int N, M;
        scanf("%d %d", &N, &M);
        char denah[100][100];
        bool visited[100][100] = {false};
        int x, y;

        for (int j = 0; j < N; j++) {
            scanf("%s", denah[j]);
            for (int k = 0; k < M; k++) {
                if (denah[j][k] == 'S') {
                    x = j;
                    y = k;
                }
            }
        }

        int result = count_floors_to_replace(denah, x, y, visited, N, M);
        printf("Case #%d: %d\n", i, result);
    }

    return 0;
}

