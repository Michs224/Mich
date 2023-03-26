#include <stdio.h>

int main(){
	int T, N, Z[1000], C, D, b, a;
	scanf("%d", &T);
	for(a=1; a<=T; a++){
		scanf("%d", &N);
		for(b=0; b<N; b++){
			scanf("%d", &Z[b]);
		}
		scanf("%d %d", &C, &D);
		if(Z[C-1]>Z[D-1]){
			printf("Case #%d : Bibi\n", a);
		}else if(Z[C-1]<Z[D-1]){
			printf("Case #%d : Lili\n", a);
		}else{
			printf("Case #%d : Draw\n", a);
		}
	}
	return(0);
}

