#include <stdio.h>

int main(){
	int T, N;
	char S[100], K[100];
	scanf("%d", &T);
	for(int a=1; a<=T; a++){
		scanf("%d", &N);
		int correct = 0;
		for(int b=1; b<=N; b++){
			scanf(" %c", &S[b]);
		}
		for(int b=1; b<=N; b++){
			scanf(" %c", &K[b]);
		}
		for(int b=1; b<=N; b++){
			if(S[b]==K[b])
				correct++;
		}
		printf("Case #%d: %d\n", a, correct*100/N);
	}
	return(0);
}

