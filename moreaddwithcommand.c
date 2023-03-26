#include <stdio.h>

int main() {
  // Read the value of N
  int N,j,l,b;
  scanf("%d", &N);

  // Initialize the count of valid combinations to 0
  int count = 0;

  // Loop through all possible values of j
  for (j = 0; j <= N; j++) {
    // Calculate the maximum value of l and b that would still give a valid combination
    int max_l = N - j;

    // Loop through all possible values of l that are less than or equal to the maximum value
    for (l = 0; l <= max_l; l++) {
      // Calculate the maximum value of b that would still give a valid combination
      int max_b = N - j - l;

      // If the sum of j, l, and b is N, increment the count
      // We don't need to loop through all possible values of b, because we know that the sum is valid
      if (j + l + max_b == N) {
        count++;
      }
    }
  }

  // Print the result
  printf("%d\n", count);

  return 0;
}
