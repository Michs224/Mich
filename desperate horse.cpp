#include <stdio.h>

#define MAX_N 10

typedef struct {
    int x;
    int y;
    int steps;
} Node;

int visited[MAX_N][MAX_N];

int dx[] = {-1, -2, -2, -1, 1, 2, 2, 1};
int dy[] = {-2, -1, 1, 2, 2, 1, -1, -2};

int min(int a, int b) {
    return a < b ? a : b;
}

int bfs(int x1, int y1, int x2, int y2) {
    Node [MAX_N * MAX_N];
    int head = 0, tail = 0;

    [tail++] = (Node){x1, y1, 0};

    while (head < tail) {
        Node cur = queue[head++];

        if (cur.x == x2 && cur.y == y2) {
            return cur.steps;
        }

        for (int i = 0; i < 8; i++) {
            int x = cur.x + dx[i];
            int y = cur.y + dy[i];

            if (x >= 0 && x < MAX_N && y >= 0 && y < MAX_N && !visited[x][y]) {
                visited[x][y] = 1;
                queue[tail++] = (Node){x, y, cur.steps + 1};
            }
        }
    }

    return -1;
}

int main() {
    int t;
    scanf("%d", &t);

    for (int i = 1; i <= t; i++) {
        int x1, y1, x2, y2;
        scanf("%d %d %d %d", &x1, &y1, &x2, &y2);

        int steps = bfs(x1, y1, x2, y2);

        printf("Case #%d: %d\n", i, steps);
    }

    return 0;
}

