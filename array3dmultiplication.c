#include <stdio.h>
#include <math.h>

int main(){

	int i,j,k,n,m,answer;
	printf("PROGRAM PERKALIAN ARRAY 3D YANG MEMILIKI DEPTH 2\n\n");
    printf("Masukkan baris dan kolom dari matriks: ");
	scanf("%d %d",&m,&n);
	int num[n][m][2];
	int ans[n][m];

	for(k=0;k<2;k++){
		for(i=0;i<n;i++){
			for(j=0;j<m;j++){
			printf("Value di index[%d][%d][%d]: ",i,j,k);
			scanf("%d", &num[i][j][k]);
			}
		}
	}
	if (m==n){
		for(k=0;k<n;k++){
			for(j=0;j<m;j++){
				answer=0;
				for(i=0;i<n;i++){
			
                	answer += num[k][i][0] * num[i][j][1];

			}
             		ans[k][j] = answer;
		}
	}
	 printf("Hasil perkalian: \n");
    for(k = 0; k < n; k++){
        for(j = 0; j < m; j++){
            printf("%d ", ans[k][j]);
        }
      printf("\n");
    }
  }

	else{
		printf("Invalid \"Ordo matriks tidak memenuhi syarat perkalian matriks\"\n");
	}
	return 0;
}

