#include <stdio.h>
#include <string.h>

int main(){
	int A,B,T,ans;
	scanf("%d",&T);
	
	for(int t=1; t<=T; t++){
		scanf("%d%d",&A,&B);
		ans = A;
		while(A/B>0){
			ans+=A/B;
			A=A/B+A%B;
		}
		printf("Case #%d: %d\n", t, ans);
	}
}
