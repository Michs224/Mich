	#include<stdio.h>
	
	int main(){
	int tc, N, ice[111], perimeter, area;
	int a,b;
	FILE *file;
	file = fopen("testdata.in", "r");
	fscanf(file, "%d\n", &tc);
	
	for(a=1; a<=tc; a++){
	area = 0; perimeter = 0;
	fscanf(file, "%d\n", &N);
	
	for(b=0; b<N; b++){
	fscanf(file, "%d", &ice[b]);
	}
	
	for(b=0; b<N; b++){
	perimeter = perimeter + (8*ice[b] - (4*(ice[b]-1)));
	area = area + (4*ice[b]);
	if(b != N-1){
		
	if(ice[b] <= ice[b+1]){
	perimeter=perimeter - (4*ice[b]);
	}
	
	else{
	perimeter=perimeter - (4*ice[b+1]);
	}
	}
	
	}
	
	printf("Case #%d: %d %d\n", a, perimeter, area);
	}
	return 0;
	}
