#include <stdio.h>

int main(){
	int F[52], FT[52], T, N;
	F[0] = 1;
	F[1] = 2;
	FT[0] = 0;
	FT[1] = 0;
	
	for(int i=2; i<=50; i++){
		FT[i] = 0;
		if(i%5==0){
			F[i] = i*2;
			if(i%3==0) FT[i] = 1;
			else FT[i] = 0;
		}
		else{
			F[i] = F[i-1] + i + F[i-2] + i - 2;
			FT[i] = FT[i-1] + FT[i-2];
			if(i%3==0) FT[i]++;
		}
	}
	scanf("%d", &T);
	for(int t=1; t<=T; t++){
		scanf("%d", &N);
		printf("Case #%d: %d %d\n", t, F[N], FT[N]);
	}
	
}
