#include <stdio.h>

int main(){
	int T, N, A[1000], P, Q;
	scanf("%d", &T);
	for(int i=1; i<=T; i++){
		scanf("%d", &N);
		for(int j=0; j<N; j++){
			scanf("%d", &A[j]);
		}
		scanf("%d %d", &P, &Q);
		if(A[P-1]>A[Q-1]){
			printf("Case #%d : Bibi\n", i);
		}else if(A[P-1]<A[Q-1]){
			printf("Case #%d : Lili\n", i);
		}else{
			printf("Case #%d : Draw\n", i);
		}
	}
}
