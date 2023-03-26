#include <stdio.h>
#include <string.h>


int count=0;
int flood(int N, char arr[][N], int i, int j){

	if(arr[i-1][j]== '.'){
		arr[i-1][j]='x';
		count++;
		i=i-1;
		return flood(N,arr, i,j);
	}
	if(arr[i][j-1]=='.'){
		arr[i][j-1]='x';
		count++;
		j=j-1;
		return flood(N,arr, i,j);
	}
	if(arr[i][j+1]=='.'){
		arr[i][j+1]='x';
		count++;
		j=j+1;
		return flood(N,arr, i,j);
	}
	if(arr[i+1][j]=='.'){
		arr[i+1][j]='x';
		count++;
		i=i+1;
		return flood(N,arr, i,j);
	}
		
}

int main(){
	int T,M,N,i,j,k,l;
	scanf("%d",&T);
	
	for(i=0;i<T;i++){
		scanf("%d %d\n",&M,&N);
		char arr[M][N];
		for(i=0;i<M;i++){
			for(j=0;j<N;j++){
				scanf(" %c",&arr[i][j]);
			}
		
		}
		
		for(k=0;k<M;k++){
			for(l=0;l<N;l++){
				if(arr[k][l]=='S'){
					int x=flood(N,arr,k,l);
					printf("%d\n",x);
				}
			}
		
		}

	}
	return 0;	
}
