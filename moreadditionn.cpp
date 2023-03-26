#include <stdio.h>

int main() {
  int N,j,l,b;
  scanf("%d", &N);
  int count = 0;

  for (j = 0; j <= N; j++) {
    int max_l = N - j;

    for (l = 0; l <= max_l; l++) {
      int max_b = N - j - l;
      if (j + l + max_b == N) {
        count++;
      }
    }
  }
  printf("%d\n", count);

  return 0;
}
