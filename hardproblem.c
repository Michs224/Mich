#include <stdio.h>

int main(){
	int T, N,i,j,benar;
	char S[100], K[100];
	scanf("%d", &T);
	for(i=1; i<=T; i++){
		scanf("%d", &N);
		int benar = 0;
		for(j=1; j<=N; j++){
			scanf("%c", &S[j]);
		}
		for(j=1; j<=N; j++){
			scanf("%c", &K[j]);
		}
		for(j=1; j<=N; j++){
			if(S[j]==K[j])
				benar++;
		}
		printf("Case #%d: %d\n", i, benar*100/N);
	}
	
	return(0);
}
