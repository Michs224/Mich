#include <stdio.h>
int N,M;
char flood(int i,int j,int n,int m,char arr[N][M]){
	for(int i=0;i<n;i++){
		
	}
	
}

int main(){
	int T,N,M;
	scanf("%d",&T);
	for(int x=0;x<T;x++){
	
	scanf("%d %d",&N,&M);
	char arr[N][M];
	
	for(int i=0;i<N;i++){
		for(int j=0;j<M;j++){
			scanf("%c",arr[i][j]);
		}printf("\n");
	}
	
	for(int i=0;i<N;i++){
		for(int j=0;j<M;j++){
			if(arr[i][j]=='S'){
				flood(arr,i,j,N,M);
			}
		}
	}
	
}
	
	
	
	
}
