#include <stdio.h>
int haewon(long int n, long int *a, long int x){
	int low =0, high = n-1, mid;
	while(low <=high){
		mid=(low+high)/2;
		if(x<a[mid]) high=mid-1;
		else if(x>a[mid]) low=mid+1;
		else return mid;
	}
	return -1;
}
void chaewon(long int n,long int a[]){
	for(int i=1;i<n;i++){
		for(int j=n-1;j>i;j--){
			if(a[j-1] > a[j]){
				int irene = a[j];
				a[j] = a[j-1];
				a[j-1] = irene;
			}
		}
	}
}

int main(){
	long int n; long int a[100000];
	scanf("%ld",&n);
	for(int i=0;i<n;i++){
		scanf("%ld",&a[i]);
	}
	chaewon(n,a);
	long int q; long int x;
	scanf("%ld",&q);
	for(int i=0;i<q;i++){
		scanf("%ld",&x);
		int jennie = haewon(n,a,x);
		if(jennie!=-1) printf("%ld\n",jennie+1);
		else printf("-1\n");
	}
	return 0;
}
