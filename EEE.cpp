#include <stdio.h>

int main(){
	long long N,Y;
	
	scanf("%ld",&N);
	long long X[N];
	
	for(int i=0;i<N;i++){
		scanf("%ld",&X[i]);
	}
	scanf("%ld",&Y);
	
	for(int i=0;i<N;i++){
		for(int j=N-1;j>i;j--){
			if(X[j-1]>X[j]){
				int tukar=X[j];
				X[j]=X[j-1];
				X[j-1]=tukar;
			}
		}
	}
	for(int i=0;i<N;i++){
		printf("%d ",X[i]);
	}printf("\n");
	int count[N];
	for(int i=N-1;i>=0;i--){
		count[i]=0;
		printf("%d ",count[i]);
	}printf("\n");
	for(int i=N-1;i>=0;i--){
	if(i<N-1) {
		Y=X[i];
		
	}
		for(long int j=N-1;j>=0;j--){
			if(Y>=X[j]){
				printf("%d\n",Y);
				count[j]++;
				Y=X[j];
				printf("%d %d\n",count[j],Y);
			}
		}

	}
	
	for(int i=N-1;i>=0;i--){
		printf("%d ",count[i]);
	}printf("\n");
	
	int max=count[0];
	for(int i=0;i<N;i++){
		if(count[i]>max){
			max=count[i];
		}
	}
	
	
	printf("%d\n",max);
	
	return 0;
}
