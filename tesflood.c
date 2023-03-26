#include <stdio.h>
int count;

void flood(int N, int M,char str[][M],int i,int j){
	if(str[i][j]=='.'){
		count++;
	}
	
	if(str[i][j]!='#'){
		str[i][j]='#';
		if(i>0){
			flood(N,M,str,i-1,j);
		}
		
		if(i<N-1){
			flood(N,M,str,i+1,j);
		}
		
		if(j>0){
			flood(N,M,str,i,j-1);
		}
		
		if(j<M-1){
			flood(N,M,str,i,j+1);
		}
	}
	
}


int main(){
	int T,N,M,i,j,k;
	scanf("%d",&T);
	for(k=0;k<T;k++){
		scanf("%d %d",&N,&M);
		char str[N][M];
//		for(i=0;i<N;i++){
			for(j=0;j<M;j++){
				scanf("%s",&str[j]);
			}
//		}

//				for(i=0;i<N;i++){
//			count=0;
//			for(j=0;j<M;j++){
//			printf("%c",str[i][j]);
//			}printf("\n");
//		}
		for(i=0;i<N;i++){
//			count=0;
			for(j=0;j<M;j++){
				if(str[i][j]=='S'){
					flood(N,M,str,i,j);
				}
			}
		}
		
		printf("Case #%d: %d\n",k+1,count);
		count=0;
	}
	
	return 0;
}
