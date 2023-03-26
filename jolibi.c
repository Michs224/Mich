#include <stdio.h>
#include <math.h>

int main(){

int N,M,jojo,lili,bibi,i,count1,count2,count3,countavg;
scanf("%d",&N);
scanf("%d %d %d",&jojo,&lili,&bibi);
count1=jojo+lili+bibi;
count2=0;
count3=3;

for(i=0;i<N;i++){
	scanf("%d",&M);
	count2+=M;
	count3++;
}
countavg=(count1+count2)/count3;

if (jojo>=countavg && lili>=countavg && bibi>=countavg) printf("Jojo lolos\nLili lolos\nBibi lolos\n");
else if (jojo>=countavg && lili>=countavg && bibi<=countavg) printf("Jojo lolos\nLili lolos\nBibi tidak lolos\n");
else if (jojo>=countavg && lili<=countavg && bibi<=countavg) printf("Jojo lolos\nLili tidak lolos\nBibi tidak lolos\n");
else if (jojo>=countavg && lili<=countavg && bibi>=countavg) printf("Jojo lolos\nLili tidak lolos\nBibi lolos\n");
else if (jojo<=countavg && lili>=countavg && bibi>=countavg) printf("Jojo tidak lolos\nLili lolos\nBibi lolos\n");
else if (jojo<=countavg && lili>=countavg && bibi<=countavg) printf("Jojo tidak lolos\nLili lolos\nBibi tidak lolos\n");
else if (jojo<=countavg && lili<=countavg && bibi>=countavg) printf("Jojo tidak lolos\nLili tidak lolos\nBibi lolos\n");
else if (jojo<=countavg && lili<=countavg && bibi<=countavg) printf("Jojo tidak lolos\nLili tidak lolos\nBibi tidak lolos\n");
return(0);
}
