#include <stdio.h>

int main() {
	int N, M, i, j,c[N][M],A;
	long long fibo[100];
	fibo[0] = 0;
	fibo[1] = 0;
	fibo[2] = 1;
	
	for(A = 1; A<=2; A++){
	printf("%d ",fibo[A]);
}
	
	for(A = 3; A<100; A++){
	fibo[A] = fibo[A-1] + fibo[A-2];
	printf("%d ",fibo[A]);
}
	
	scanf("%d %d", &N,&M);
	for(i=0; i<N; i++){
		for(j=0; j<M; j++){
			c[N][M]=fibo[A];
			printf("%llu ",c[N][M]);
	}
	
}

	return(0);
}

