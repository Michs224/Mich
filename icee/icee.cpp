#include <stdio.h>

int main(){
	int T,N,x[101],area,perimeter;
	FILE*ice;
	ice=fopen("testdata.in","r");
	fscanf(ice,"%d\n",&T);
	
	for(int i=1;i<=T;i++){
		area=0,perimeter=0;
		fscanf(ice,"%d\n",&N);
		for(int j=0;j<N;j++){
			fscanf(ice,"%d",&x[j]);
//			if (j<N-1) fscanf(ice," ");
			area+= 4*x[j];
		}
	
		for(int j=0;j<N-1;j++){
			if (x[j]>x[j+1]) perimeter+=2*(x[j]-x[+1]);
			else if(x[j]<x[j+1]) perimeter+=2*(x[j+1]-x[j]);
		}
		
		perimeter+=2*N*2 + 2*(x[0]+x[N-1]);
		
		printf("Case #%d: %d %d\n",i,perimeter,area);
	
	}
	
	return(0);
}
