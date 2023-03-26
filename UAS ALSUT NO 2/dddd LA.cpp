#include <stdio.h>


int main(){
	int tsc;
	scanf("%d",&tsc);
	
	for(int i=0;i<tsc;i++){
		int x,n;
		scanf("%d %d",&x,&n);
		int arr[x];
		for(int j=0;j<x;j++){
			scanf("%d",&arr[j]);
		}
		int temp, num=0;
		for(int j=0;j<x;j++){
			for(int k=x-1; k>j;k--){ // bubble sort
				if(arr[k] < arr[k-1]){
					temp = arr[k-1];
					arr[k-1] = arr[k];
					arr[k] = temp;
					num+=n;
				}
			}
		}
		printf("Case #%d : %d\n", i+1,num);
	}
}
