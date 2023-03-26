#include <stdio.h>
int main(){
	int T, N;
	long long fibo[92];
	fibo[1] = 0;
	fibo[2] = 1;
	for(int i = 3; i<=90; i++){
		fibo[i] = fibo[i-1] + fibo[i-2];
	}
	scanf("%d", &T);
	for(int i=1; i<=T; i++){
		scanf("%d", &N);
		printf("Case #%d: %llu\n",i,fibo[N]);
	}
}
