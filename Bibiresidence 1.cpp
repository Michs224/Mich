#include <stdio.h>

int main(){
	int T,H[1000],y,Min;
	int X[1000],N;
	scanf("%d",&T);
	
	int x,z;
	for(x=1;x<=T;x++){
		scanf("%d",&N);
		
		for(y=0;y<N;y++){
			scanf("%d",&X[y]);		
		}
		for(z=0;z<N-1;z++){
			if (X[z]>=1 && X[z]<X[z+1]){
				H[z]=X[z+1]- X[z];
			}else if(X[z]>=1 && X[z]>X[z+1]){
				H[z]=X[z]- X[z+1];
			}else if (X[z]>=1 && X[z]==X[z+1]){
				H[z]=X[z]- X[z+1];
			}
		}
		Min=H[0];
		for(z=0;z<N-1;z++){
			if(H[z]<Min){
				Min=H[z];
			} 
		}
		printf("Case #%d: %d\n",x,Min);	
    }
	
		return 0;
	}

