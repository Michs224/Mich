#include <stdio.h>

int main(){
	int T, N, M, check, x;
	char arr[10005];
	scanf("%d", &T);
	for(int t=1; t<=T; t++){
		check = 1;
		for(int i=1; i<=10000; i++) arr[i]=1;
		
		scanf("%d %d", &N, &M);
		for(int i=0; i<M; i++){
			scanf("%d", &x);
			for(int j=x; j<=N; j+=x){
				arr[j] = (arr[j]+1)%2;
			}
		}
		
		printf("Case #%d:", t);
		for(int i=1; i<=N; i++){
			if(arr[i]==1){
				if(check == 1) check = 0;
				printf(" %d", i);
			}
		}
		if(check == 1) printf(" No room left!");
		printf("\n");
	}
}
