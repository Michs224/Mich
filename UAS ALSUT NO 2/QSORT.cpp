#include <stdio.h>

void swap(int *x,int *y){
	int temp=*y;
	*y=*x;
	*x=temp;
}

int partition (int a[],int left, int right){
	
	int pivot=a[right];
	int i=left-1;
	
	for(int j=left;j<right;j++){
		if(a[j]<=pivot){
			i++;
			swap(&a[i],&a[j]);
		}
	}
	swap(&a[i+1],&a[right]);
	return i+1;
}

void quicksort(int a[],int left, int right){
	if(left<right){
		int pi=partition(a,left,right);
		
		quicksort(a,left,pi-1);
		quicksort(a,pi+1,right);
	}

}

int main(){
	int T,N;
	
	scanf("%d",&T);
	for(int i=0;i<T;i++){
		scanf("%d",&N);
		int arr[N];
		for(int j=0;j<N;j++){
			scanf("%d",&arr[j]);
		}
		quicksort(arr,0,(sizeof(arr)/sizeof(arr[0]))-1);
		
		for(int k=0;k<N;k++){
			printf("%d ",arr[k]);
		}
	}
}
