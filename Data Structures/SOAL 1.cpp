#include <stdio.h>



int main(){
	int x,arr[1001],count=0,count2=0;
	
	scanf("%d",&x);
	
	for(int i=0;i<x;i++){
		scanf("%d",&arr[i]);
	}	
	for(int i=1;i<=x;i++){
		count=arr[i-1];
		for(int j=1;j<=x;j++){
			count+=arr[j-1];
			if(count==9){
				count2++;
			}
		}
	}
	printf("Total sub array that can be sum up to 9: %d\n",count2);
	
	return 0;
	
}
