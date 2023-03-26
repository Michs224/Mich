#include <stdio.h>
#include <string.h>

const int N=101;
int count=0;
int flood(int N, char arr[][N], int i, int j){
	if(arr[i-1][j]== '.'){
		arr[i-1][j]='x';
		count++;
		i=i-1;
		return flood(arr, i,j);
	}
	if(arr[i][j-1]=='.'){
		arr[i][j-1]='x';
		count++;
		j=j-1;
		return flood(arr, i,j);
	}
	if(arr[i][j+1]=='.'){
		arr[i][j+1]='x';
		count++;
		j=j+1;
		return flood(arr, i,j);
	}
	if(arr[i+1][j]=='.'){
		arr[i+1][j]='x';
		count++;
		i=i+1;
		return flood(arr, i,j);
	}
		
}

int main(){
	int T,M,N;
	scanf("%d",&T);
	
	for(int i=0;i<T;i++){
		scanf("%d %d\n",&M,&N);
		char arr[M][N];
		for(int i=0;i<M;i++){
			for(int j=0;j<N;j++){
				scanf(" %c",&arr[i][j]);
			}
		
		}
		
		for(int k=0;k<M;k++){
			for(int l=0;l<N;l++){
				if(arr[k][l]=='S'){
					int x=flood(arr,k,l);
				}
			}
		
		}

	}
	return 0;	
}
