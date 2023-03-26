#include <stdio.h>

int binarySearch(int arr[],int n,int x){
	int low=0,high=n,mid;
	while(low<=high){
		mid=(low+high)/2;
		if(x<arr[mid]) high=mid-1;
		else if(x>arr[mid]) low=mid+1;
		else return mid+1;
	}
	return -1;
}

int main(){
	int N,Q,x;
	
	scanf("%d",&N);
	int arr[N];
	for(int i=0;i<N;i++){
		scanf("%d",&arr[i]);
	}
	
	for(int i=0;i<N;i++){
		for(int j=N-1;j>i;j--){
			if(arr[j-1]>arr[j]){
				int tukar=arr[j];
				arr[j]=arr[j-1];
				arr[j-1]=tukar;
			}
		}
	}
	scanf("%d",&Q);
	for(int i=0;i<Q;i++){
		scanf("%d",&x);

		int y=binarySearch(arr,N,x);
		printf("%d\n",y);
}
	return 0;
}
