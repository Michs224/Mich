#include <stdio.h>


void swap(int *x, int *y){
	int temp;
	
	temp = *y;
	*y = *x;
	*x = temp;
}

int partition(int a[],int left, int right){
	
	int pivot = a[right];
	int i = (left-1);
	
	for(int j=left;j<right;j++){
		if(a[j] <= pivot){
			i++;
			swap(&a[i],&a[j]);
		}
	}
	swap(&a[i+1],&a[right]);
	return i+1;
	
}



void quicksort(int a[],int left, int right){
	
	
	if (left<right){
		int pi = partition(a,left,right);
		
		quicksort(a,left,pi-1);
		quicksort(a,pi+1,right);
	}
}




int main(){
	
	
	int N,a[1001];
	
	scanf("%d",&N);
	for(int i=0;i<N;i++){
		scanf("%d",&a[i]);
	}
	quicksort(a,0,(sizeof(a)/sizeof(a[0]))-1);
	
//	for(int i=0;i<N;i++){
//		printf("%d ",a[i]);
//		
//	}
	
	for(int i = 0;i<N;i++){
		printf("%d ",a[i]);
	}
	return 0;
}
