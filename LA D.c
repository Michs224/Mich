#include <stdio.h>


int main(){
	
	int T,N,X,arr[1001],i,j,k,l;
	
	scanf("%d",&T);
	for(i=0;i<T;i++){
		scanf("%d %d",&N,&X);
		for(j=0;j<N;j++){
			scanf("%d",&arr[j]);
		}
		
		int num=0;
		for(k=0;k<N;k++){
		for(l=N-1;l>k;l--){
			if(arr[l-1]>arr[l]){
				int tukar=arr[l];
				arr[l]=arr[l-1];
				arr[l-1]=tukar;
				num+=X;
			}

		}
	}
	
	
	printf("Case #%d: %d\n",i+1,num);
	
	}
	
	
	return 0;
}
