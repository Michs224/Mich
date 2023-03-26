#include <stdio.h>

int main(){
	int arr[5]={12,5,20,49,3};
	int N=sizeof(arr)/sizeof(arr[0]);
	int i,j;
	printf("%d\n",sizeof(arr)/sizeof(arr[0]));
	
	

//	//Bubblesort
//	for (i=0;i<sizeof(arr)/sizeof(arr[0]);i++){
//		for(j=sizeof(arr)/sizeof(arr[0])-1;j>i;j--){
//			if(arr[j-1]>arr[j]){
//				int tukar=arr[j];
//				arr[j]=arr[j-1];
//				arr[j-1]=tukar;
//			}
//		}
//		
//	}
	
//	//Selectionsort
//	for(i=0;i<sizeof(arr)/sizeof(arr[0])-1;i++){
//		int idxs=i;
//		for(j=i+1;j<sizeof(arr)/sizeof(arr[0]);j++){
//			if(arr[j]<arr[idxs])idxs=j;
//		}
//		int tukar=arr[idxs];
//		arr[idxs]=arr[i];
//		arr[i]=tukar;
//	}
	
//	//Insertionsort
//	for(i=1;i<N;i++){
//		int temp=arr[i];
//		j=i-1;
//		while(j>=0 && temp<arr[j]){
//			arr[j+1]=arr[j];
//			j--;
//		}
//		arr[j+1]=temp;
//		
//	}
	
	
	for(i=0;i<N;i++){
		printf("%d ",arr[i]);
	}
	
	return 0;
}
