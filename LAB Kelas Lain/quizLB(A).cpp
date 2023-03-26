#include <stdio.h>
#include <string.h>
#include <math.h>

int main(){
	int T,N;
	float avg,tamp[101],temp=0;
	scanf("%d",&T);
	for(int i=0;i<T;i++){

		scanf("%d",&N);
		float arr[N];
		for(int j=0;j<N;j++){
			scanf("%f",&arr[j]);
			temp+=arr[j];
		}
		avg=temp/N;
		printf("%f\n",avg);
		for(int i=0;i<N;i++){
			tamp[i]=abs(avg-arr[i]);
			printf("%f\n",tamp[i]);
		}
	
		
		int small;
		for(int i=0;i<N-1;i++){
			small=i;
			for(int j=i+1;j<N;j++){
				if(tamp[j]<tamp[small]) small=j;
				if(tamp[j]==tamp[small]) small=small;
			}
//			printf("cCase #%d: %d\n",i+1,arr[small]);
		}
		printf("Case #%d: %d\n",i+1,arr[small]);

	}
}
