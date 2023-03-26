#include <stdio.h>


int countArea(int n, int* matrix) {
  int area = 0;
  for (int i = 0; i < n*n; i++) {

      if (matrix[i] == 1) {
        area++;
        matrix[i] = 0;
        if (i == 0 && matrix[i+n] == 1) area += countArea(n, matrix);
        if(i==0 && matrix[i+1]==1) area+= countArea(n, matrix);
        if (i > 0 && i<(n*n)-n && matrix[i+1] == 1) area += countArea(n, matrix);
        if (j > 0 && matrix[i] == 1) area += countArea(n, matrix);
        if (j < n-1 && matrix[i] == 1) area += countArea(n, matrix);
      }
    
  }

  return area;
}

int main() {
  int N;
  scanf("%d", &N);

  int mat1[N][N],mat2[N][N];
  for(int i=0;i<N;i++){
  		for(int j=0;j<N;j++) {
		mat1[i][j]=0;
		mat2[i][j]=0;
	}
  }
	
  for (int i = 0; i < N; i++) {
    for (int j = 0; j < N; j++) {
      scanf("%d", &mat1[i][j]);
    }
  }

  for (int i = 0; i < N; i++) {
    for (int j = 0; j < N; j++) {
      scanf("%d", &mat2[i][j]);
    }
  }
  int area1,area2;
  area1 = countArea(N, (int *)mat1);
  area2 = countArea(N, (int *)mat2);

  if (area1 > area2) printf("Object 1 is bigger\n");
  else if (area1 < area2) printf("Object 2 is bigger\n");
  else printf("Object 1 and 2 has the same size\n");

  return 0;
}

