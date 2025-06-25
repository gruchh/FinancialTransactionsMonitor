package com.financialtransactions.monitor.model.dto;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NbpExchangeRateResponse {

    private String table;
    private String currency;
    private String code;
    private List<Rate> rates;

    @Getterg
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Rate {
        @JsonProperty("no")
        private String number;

        @JsonProperty("effectiveDate")
        private LocalDate effectiveDate;

        @JsonProperty("mid")
        private BigDecimal mid;
    }

=======
public class NbpExchangeRateResponse {
>>>>>>> 2e3e4583de033bf4180a092d2deca7ba858b7a7e
}
