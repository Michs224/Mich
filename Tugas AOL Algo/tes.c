#include <stdio.h>

int mat1[10000][10000], mat2[10000][10000];

int countArea(int n, int matrix[10000][10000]) {
  int x,y,area;
  area=0;
  for (x = 0; x < n; x++) {
    for (y = 0; y < n; y++) {
      if (matrix[x][y] == 1) {
        area++;
        matrix[x][y] = 0;
        if (x > 0 && matrix[x-1][y] == 1) area += countArea(n, matrix);
        if (x < n-1 && matrix[x+1][y] == 1) area += countArea(n, matrix);
        if (y > 0 && matrix[x][y-1] == 1) area += countArea(n, matrix);
        if (y < n-1 && matrix[x][y+1] == 1) area += countArea(n, matrix);
      }
    }
  }

  return area;
}

int main() {
  int N,i,j;
  scanf("%d", &N);
  for (i = 0; i < N; i++) {
    for (j = 0; j < N; j++) {
      mat1[i][j]=0;
      mat2[i][j]=0;
    }
  }

  
  for (i = 0; i < N; i++) {
    for (j = 0; j < N; j++) {
      scanf("%d", &mat1[i][j]);
    }
  }

  for (i = 0; i < N; i++) {
    for (j = 0; j < N; j++) {
      scanf("%d", &mat2[i][j]);
    }
  }

  int area1 = countArea(N, mat1);
  int area2 = countArea(N, mat2);

  if (area1 > area2) printf("Object 1 is bigger\n");
  else if (area1 < area2) printf("Object 2 is bigger\n");
  else printf("Object 1 and 2 has the same size\n");

  return 0;
}

