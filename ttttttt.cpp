	#include <stdio.h>
	
	int main (){
		
printf("+-------+----------+----------------+\n| Month | Interest |  Total Amount  |\n+-------+----------+----------------+\n");
    fprintf(plannedSavingReport, "+-------+----------+----------------+\n| Month | Interest |  Total Amount  |\n+-------+----------+----------------+\n");

    for (int i = 0; i < duration; i++)
    { 
        interestRate = savingInterestRate(i+1, monthlyAmount);
        
        totalSaving += monthlyAmount + interest;
        printf("| %-5d | Rp %-5d | Rp %-11d |\n", i+1, interest, totalSaving);
        fprintf(plannedSavingReport, "| %-5d | Rp %-5d | Rp %-11d |\n", i+1, interest, totalSaving);
    }
    
    printf("+-------+----------+----------------+\n");
    fprintf(plannedSavingReport, "+-------+----------+----------------+\n");
}

