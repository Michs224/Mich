#include <stdio.h>

int main(){
	int mark;
	char grade;
	scanf("%d",&mark);
	
	if(mark>=85)
	grade = 'A';
	if(mark>=75)
	grade = 'B';
	
printf("%c",grade);
}
