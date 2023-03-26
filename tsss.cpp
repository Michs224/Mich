#include <stdio.h>

int main(){
	int t, n, es[111], perimeter, area;
	int i,j;
	FILE *file;
	file = fopen("testdata.in", "r");
	fscanf(file, "%d\n", &t);
	for(i=1; i<=t; i++){
		area = 0; perimeter = 0;
		fscanf(file, "%d\n", &n);
		for(j=0; j<n; j++){
			fscanf(file, "%d", &es[j]);
			}
		for(j=0; j<n; j++){
			perimeter = perimeter + (8*es[j] - (4*(es[j]-1)));
			area = area + (4*es[j]);
			if(j != n-1){
				if(es[j] <= es[j+1]){
				perimeter=perimeter - (4*es[j]);
				}
			else{
				perimeter=perimeter - (4*es[j+1]);
				}
			}
		}
	printf("Case #%d: %d %d\n", i, perimeter, area);
	}
	return 0;
}
