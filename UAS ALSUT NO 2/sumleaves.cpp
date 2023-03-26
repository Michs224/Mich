#include <stdio.h>
#include <stdlib.h>

const int MAX_N = 100;

int T; // jumlah test case
int n[MAX_N + 5]; // jumlah cabang pada setiap test case
int a[MAX_N + 5][MAX_N + 5]; // jumlah daun pada setiap cabang
int sum[MAX_N + 5]; // jumlah daun pada cabang terbawah
int curr; // counter cabang terbawah

void dfs(int now, int total) {
    // cabang ini adalah cabang terbawah
    if (now > n[curr]) {
        sum[curr] = total;
        return;
    }

    // pergi ke cabang kiri
    dfs(now * 2, total + a[curr][now]);

    // pergi ke cabang kanan
    dfs(now * 2 + 1, total + a[curr][now]);
}

int main(void) {
    scanf("%d", &T);

    for (curr = 1; curr <= T; curr++) {
        scanf("%d", &n[curr]);
for (int i = 1; i <= n[curr]; i++) {
scanf("%d", &a[curr][i]);
}
dfs(1, 0);
}

for (curr = 1; curr <= T; curr++) {
    printf("Case #%d:\n%d\n", curr, sum[curr]);
}

return 0;
}

